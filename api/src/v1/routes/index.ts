import { Router } from 'express'
import user_routes from '@/modules/users/user.routes'
import auth_routes from '@/modules/auth/auth.routes'
import me_routes from '@/modules/me/me.routes'
import feature_routes from '@/modules/features/features.routes'
import reset_password_routes from '@/modules/resetPassword/resetPassword.routes'
import security_routes from '@/modules/security/security.routes'
import projects_routes from '@/modules/projects/project.routes'
import user_project_routes from '@/modules/projects/user_project.routes'
import project_site_providers_routes from '@/modules/projectSiteProviders/projectSiteProvider.routes'
import project_category_types_routes from '@/modules/projectCategoryTypes/projectCategoryType.routes'
import project_comment_routes from '@/modules/projectComments/projectComment.routes'
import universes_routes from '@/modules/universes/universe.routes'
import sagas_routes from '@/modules/sagas/saga.routes'
import sagas_universe_routes from '@/modules/universes/sagas/saga.routes'
import books_routes from '@/modules/books/book.routes'
import books_universe_routes from '@/modules/universes/books/book.routes'
import books_saga_routes from '@/modules/sagas/books/book.routes'
import characters_routes from '@/modules/characters/character.routes'

const router = Router()

// prueba de features 
router.use('/features', feature_routes)

// AUTH
router.use('/auth', auth_routes)
router.use('/me', me_routes)

// USERS
router.use('/users', user_routes)
router.use('/reset-password', reset_password_routes)

// SECURITY
router.use('/security', security_routes)

// PROJECTS
router.use('/projects', projects_routes)
router.use('/projectSiteProviders', project_site_providers_routes)
router.use('/projectCategoryTypes', project_category_types_routes)
router.use('/users/:user_id/projects/:project_id/comments', project_comment_routes)
router.use('/', user_project_routes)

// UNIVERSES
router.use('/projects/:project_id/universes', universes_routes)

// SAGAS
router.use('/projects/:project_id/sagas', sagas_routes)
router.use('/projects/:project_id/universes/:universe_id/sagas', sagas_universe_routes)

// BOOKS
router.use('/projects/:project_id/books', books_routes)
router.use('/projects/:project_id/universes/:universe_id/books', books_universe_routes)
router.use('/projects/:project_id/sagas/:saga_id/books', books_saga_routes)

// CHARACTERS
router.use('/projects/:project_id/characters', characters_routes)
router.use('/projects/:project_id/universes/:universe_id/characters', characters_routes)
router.use('/projects/:project_id/sagas/:saga_id/characters', characters_routes)
router.use('/projects/:project_id/books/:book_id/characters', characters_routes)


export default router
