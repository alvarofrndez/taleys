import { useSelector, useDispatch } from 'react-redux'
import { closeModal } from '@/stores/modalSlice'
import styles from '@/assets/global/modal/modal.module.scss'
import Loader from '@/components/Loader'
import TwoFactorAuthenticationComponent from '@/components/modal/auth/settings/security/twoFactorAuthentication'
import Dialog from '@/components/modal/Dialog'
import ChangePassword from '@/components/modal/auth/settings/security/changePassword'
import CreateProject from '@/components/modal/auth/projects/createProject'
import DeleteProjectConfirmation from '@/components/modal/auth/projects/deleteProjectConfirmation'
import CreateUniverse from '@/components/modal/auth/projects/childs/createUniverse'
import CreateSaga from '@/components/modal/auth/projects/childs/createSaga'
import CreateBook from '@/components/modal/auth/projects/childs/CreateBook'
import CreateCharacter from '@/components/modal/auth/projects/childs/CreateCharacter'
import CreateUniverseChild from '@/components/modal/auth/projects/universes/childs/CreateUniverseChild'
import CreateUniverseSaga from '@/components/modal/auth/projects/universes/childs/CreateUniverseSaga'
import CreateUniverseBook from '@/components/modal/auth/projects/universes/childs/CreateUniverseBook'
import CreateUniverseCharacter from '@/components/modal/auth/projects/universes/childs/CreateUniverseCharacter'
import CreateSagaChild from '@/components/modal/auth/projects/sagas/childs/CreateSagaChild'
import CreateSagaBook from '@/components/modal/auth/projects/sagas/childs/CreateSagaBook'
import CreateSagaCharacter from '@/components/modal/auth/projects/sagas/childs/CreateSagaCharacter'
import CreateBookCharacter from '@/components/modal/auth/projects/books/childs/CreateBookCharacter'
import CreateCharacterAppearance from '@/components/modal/auth/projects/characters/appearances/CreateCharacterAppearance'
import EditCharacterAppearance from '@/components/modal/auth/projects/characters/appearances/EditCharacterAppearance'
import CreateCharacterRelationship from '@/components/modal/auth/projects/characters/relationships/CreateCharacterRelationship'
import EditCharacterRelationship from '@/components/modal/auth/projects/characters/relationships/EditCharacterRelationship'
import Icon from '@/components/iconComponent'

const component_map = {
  'TwoFactorAuthenticationComponent': TwoFactorAuthenticationComponent,
  'Dialog': Dialog,
  'ChangePassword': ChangePassword,
  'CreateProject': CreateProject,
  'DeleteProjectConfirmation': DeleteProjectConfirmation,
  'CreateUniverse': CreateUniverse,
  'CreateSaga': CreateSaga,
  'CreateBook': CreateBook,
  'CreateCharacter': CreateCharacter,
  'CreateUniverseChild': CreateUniverseChild,
  'CreateUniverseSaga': CreateUniverseSaga,
  'CreateUniverseBook': CreateUniverseBook,
  'CreateUniverseCharacter': CreateUniverseCharacter,
  'CreateSagaChild': CreateSagaChild,
  'CreateSagaBook': CreateSagaBook,
  'CreateSagaCharacter': CreateSagaCharacter,
  'CreateBookCharacter': CreateBookCharacter,
  'CreateCharacterAppearance': CreateCharacterAppearance,
  'EditCharacterAppearance': EditCharacterAppearance,
  'CreateCharacterRelationship': CreateCharacterRelationship,
  'EditCharacterRelationship': EditCharacterRelationship,
}

const ModalContainer = () => {
  const dispatch = useDispatch()
  const { is_open, component, props } = useSelector((state) => state.modal)

  const ComponentToRender = component_map[component]

  if (!is_open) return null

  return (
    <div className={styles.modalOverlay} onClick={() => dispatch(closeModal())}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {ComponentToRender ? <ComponentToRender {...props} /> : <div className={styles.contianerLoader}><Loader /></div>}
      </div>
    </div>
  )
}

export default ModalContainer