import { makeEventHandler } from './services/factories/make-event-handler'

export function onStart () {
  const eventHandler = makeEventHandler()

  void eventHandler.startListening()
}
