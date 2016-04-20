import Relay from 'react-relay';
import { connect } from 'react-redux';

export default function createComponent(Component, { relayConfig, reduxConfig } = {}) {
  let resultComponent = Component;
  if (reduxConfig) {
    const { mapStateToProps, mapDispatchToProps, mergeProps, options } = reduxConfig;
    const connectToStore = connect(mapStateToProps, mapDispatchToProps, mergeProps, options);
    resultComponent = connectToStore(resultComponent);
  }
  if (relayConfig) {
    resultComponent = Relay.createContainer(resultComponent, relayConfig);
  }
  return resultComponent;
}
