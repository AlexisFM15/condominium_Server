import { testingWorker } from './billGenerator.worker.js'

export const startWorkers = async () => {
  await testingWorker()
}
