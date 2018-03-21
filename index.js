module.exports = (robot) => {
  // Your code here
  robot.log('Yay, the app was loaded!')

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/

  robot.on('push', push)
  robot.on('status', commit_status)

  // event(s): push
  async function push(context) {
    if (context.payload.ref.split('\\')[2] === context.payload.repositories.master_branch) {
      robot.log('push to the branch: ', context.payload.ref.split('\\')[2])
      context.github.repos.createDeployment(context.repo({
        'ref': context.payload.after
      }))
    } else {
      // usecase: on a push to the master branch...
      robot.log('swallow non-master pushes')
    }
  }

  // event(s): status
  async function commit_status(context) {
    if (context.payload.branches[0].name === context.payload.repositories.master_branch) {
      robot.log('commit status received for `', context.payload.context, '`, state: ', context.payload.state, 'on branch: ', context.payload.branches[0].name, 'trace')

      // don't care what the status tool was,
      // just that it might meet the criteria
      if (context.payload.state === 'success') {
        context.github.repos.createDeployment(context.repo({
          'ref': context.payload.after
        }))
      }

      context.github.repos.createDeployment(context.repo({
        'ref': context.payload.after
      }))
    } else {
      // usecase: on a successful commit status to the master branch...
      robot.log('swallow non-master commit statuses')
    }
  }
}
