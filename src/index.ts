import { Probot } from "probot";
import { InstallationAccessTokenAuthentication } from "@octokit/auth-app/dist-types/types";

export = (app : Probot) => {  
  app.log.info("Probot-approved-pr is running")   
  /** handle depreacated tags in the andi PR's */        
  app.on("pull_request_review.submitted",
  async context => {
    const installationId = context.payload.installation?.id

    // Retrieve installation access token
    const installationAuthentication = await context.octokit.auth({
      type: "installation",
      installationId: installationId,
    }) as InstallationAccessTokenAuthentication;
    const token = installationAuthentication.token;

    if (context.payload.pull_request.merged_at === null) {
      const required_num_prr = 2
      const pr_num:number = context.payload.pull_request.number
      const pr_node_id:string = context.payload.pull_request.node_id

      const request_pr:any = await context.octokit.graphql(`query { 
        repository(owner:"DLC-Doodle-Bots-ESIR3-2021", name:"doodle") { 
          pullRequest(number: ${pr_num}) {
            merged
            reviews(first: 100, states: APPROVED) {
              totalCount
            }
          }
        }
      }`,
      {
        headers: {
          authorization: `token ${token}`,
        },
      })

      const merged:boolean = request_pr.repository.pullRequest.merged
      const num_prr:number = request_pr.repository.pullRequest.reviews.totalCount
      if (!merged) {
        if (num_prr >= required_num_prr) {
          await context.octokit.graphql(`mutation MergePullRequest { 
            mergePullRequest (input: {
              pullRequestId: "${pr_node_id}",
            }) {
              pullRequest {
                number
              }
            }
          }`,
          {
            headers: {
              authorization: `token ${token}`,
            },
          })
          
          app.log.info("Pull request merged")
        } else {
          app.log.info(`Pull request doesn't have enough reviews approved (${num_prr} approved for ${required_num_prr} required)`)
        }
      } else {
        app.log.info(`Pull request is already merged`)
      }
    }
  })
};