module.exports = (robot) => {
  // Your code here
  robot.log('Yay, the app was loaded!')

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/

  robot.on('push', push)

  // event(s): push
  async function push(context) {
    if (context.payload.ref.split('\\')[2] === context.payload.repositories.master_branch) {
      robot.log('push to the master branch')
      context.github.repos.createDeployment(context.repo({
        'ref': context.payload.after
      }))
    } else {
      // usecase: on a push to the master branch...
      robot.log('swallow non-master pushes')
    }
  }
}
