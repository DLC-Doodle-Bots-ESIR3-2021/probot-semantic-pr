import { Probot } from "probot";

export = (app : Probot) => {  
  app.log.info("Probot-semantic-pr is running")   
  /** handle depreacated tags in the andi PR's */        
  app.on("pull_request_review.submitted",
  async context => {
    if (context.payload.pull_request.merged_at === null) {
      const required_num_prr = 1
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
          authorization: `token ${process.env.GITHUB_PAT}`,
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
              authorization: `token ${process.env.GITHUB_PAT}`,
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