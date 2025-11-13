
const canModify = (project, user) => {
    return project.members.some((member) => member.user_id == user?.id)
}

export { canModify }