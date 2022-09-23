///////// user_groups //////////

// GET user_groups.json
export interface IUserGroupsGET {
    owner: number[];
    member: number[];
    other: number[];
  }
//////// users /////////////////

// POST users/auth_token.json
export interface IUsersAuthTokenGET {
    key: string
}