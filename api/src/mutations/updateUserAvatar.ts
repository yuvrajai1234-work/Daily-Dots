import { g, connector } from '@dataconnect/connector'

export const updateUserAvatar = g.mutation("updateUserAvatar", {
  id: g.ID(),
  avatar_url: g.String(),
}, async ({ id, avatar_url }) => {
  const { entities } = connector;
  const result = await entities.users.update({
    where: { id: { eq: id } },
    data: { avatar_url },
  });
  return result.data;
});
