function createMachine(stateMachineDefinition) {
    const machine = {
        value: stateMachineDefinition.initialState,
        transition(currentState, event, payload) {
            const currentStateDefinition = stateMachineDefinition[currentState]
            const destinationTransition = currentStateDefinition.transitions[event]
            if (!destinationTransition) {
                return
            }
            const destinationState = destinationTransition.target
            const destinationStateDefinition =
                stateMachineDefinition[destinationState]

            destinationTransition.action(payload)
            currentStateDefinition.actions.onExit?.()
            destinationStateDefinition.actions.onEnter?.()

            machine.value = destinationState
            console.log(`current state: ${machine.value}`)
            return machine.value
        },
    }
    return machine
}