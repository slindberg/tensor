import { connect } from 'react-redux'
import ThreeSpace from '../components/ThreeSpace'

function mapStateToProps(state, ownProps) {
  const { rotationMatrix } = state.rotation

  return {
    rotationMatrix,
    ...ownProps,
  }
}

export default connect(mapStateToProps)(ThreeSpace)
