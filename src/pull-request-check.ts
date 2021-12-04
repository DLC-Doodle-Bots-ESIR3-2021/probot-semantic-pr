import { Context }  from "probot";
export const checkDepreacatedTags = async (context: Context) => {
    const response = await context.pullRequest.toString()
    console.log(response)
}