const crypto = require("crypto");
const salt = "PeakyBlinders";

const { 
    createUser,
    createSession,
    removeSession,
    removeUser,
    getUser,
    updateUsername,
    userExists,
    checkPass,
    sessionExists,
    db
} = require("../DB");

const { 
    login,
    register,
    logout
} = require("../controllers/Auth");

const { 
    delete_,
    getData,
    update
} = require("../controllers/Profile");



describe('tests with database', () => {
  beforeAll(() => {
    createUser('userTest', 'passTest')
    createUser('otherUserTest', 'otherPassTest')
    createSession('userTest')
    createSession('otherUserTest')
  })

  afterAll(() => {
    removeUser('userTest')
    removeUser('otherUserTest')
    removeSession('userTest')
    removeSession('otherUserTest')
    removeSession('oneMoreUserTest')
  })

  test('if user was created in database', () => {
    expect(createUser('userTest', 'passTest')).toStrictEqual(getUser('userTest'))
  })

  test('if username was updated', () => {
    updateUsername('userTest', 'updatedUserTest')
    expect(getUser('updatedUserTest')).toStrictEqual(getUser('updatedUserTest', 'passTest'))
  })

  test('if deleted user exists', () => {
    removeUser('userTest')
    expect(userExists('userTest')).toBeFalsy()
  })

  test('if not registered user exists', () => {
    expect(userExists('someUnknownUserThatWasNeverHere')).toBeFalsy()
  })

  test('if another user can be created', () => {
    createUser('oneMoreUserTest', 'oneMoreUserPassword')
    expect(createUser('oneMoreUserTest', 'passTest')).toStrictEqual(getUser('oneMoreUserTest'))
    expect(createUser('userTest', 'passTest')).toStrictEqual(getUser('userTest'))

  })

  test('if password is correct', () => {
    expect(checkPass('userTest', 'someFalsePassword')).toBeFalsy()
    expect(checkPass('userTest', 'passTest')).toBe(true)
  })

  test('if sessionExists creates', () => {
    const saltedUsername = `${salt}${'userTest'}`;
    const saltedUsername2 = `${salt}${'otherUserTest'}`;

    expect(db.users).toHaveProperty('userTest')
    expect(db.users).toHaveProperty('otherUserTest')

    expect(createSession('userTest')).toBe(crypto.createHash("sha256").update(saltedUsername).digest('hex'))
    expect(createSession('otherUserTest')).toBe(crypto.createHash("sha256").update(saltedUsername2).digest('hex'))
  })

  test('if sessionExists removes', () => {
    removeSession('userTest')
    removeSession('otherUserTest')
    expect(db).not.toHaveProperty('userTest')
    expect(db).not.toHaveProperty('otherUserTest')
  })

})

describe('tests with Auth', () => {
  let cookies = {};
  let redirectUrl = "";
  let statusCode = -1;
  let jsonResponse = "";

  const res = {
    redirect: (url) => { redirectUrl = url },
    cookie: (key, value) => { cookies[key]= value },
    status: (code) => { statusCode = code; return res },
    json: (data) => { jsonResponse = data; },
  }

  beforeAll(() => {
    cookies = {}
    redirectUrl = "";
    statusCode = -1;
    jsonResponse = "";
  })

  test('Auth login controller test', () => {    
    login({ body: { username: 'kek' } }, res)

    expect(Object.keys(cookies).length).toBe(1)
    expect(redirectUrl).toBe('/')
  })

  test('Auth register controller with no body test', () => {
    register({}, res)
    expect(statusCode).toBe(404)
  })

  test('Auth register controller with password only', () => {
    register({body: {password: "pass"}}, res)
    expect(statusCode).toBe(404)
  })

  test('Auth register controller with username only', () => {
    register({body: {username: "user"}}, res)
    expect(statusCode).toBe(404)
  })

  test('Auth register controller with body test', () => {
    createUser('user', 'pass')
    register({body: {username: "user", password: "pass"}}, res)
    expect(statusCode).toBe(404)
    removeUser('user')
  })

  test('Auth json response test', () => {
    register({body: {username: "user", password: "pass"}}, res)
    expect(jsonResponse?.username).toBe('user')
    expect(jsonResponse?.password).not.toBe('')
  })
})

describe('tests with Profile', () => {
  let redirectUrl = "";
  let cookies = {};
  let statusCode = -1;
  let jsonResponse = "";

  const req = {
    body: {
      newUsername: "",
    },
    sessionData: { username: "user", password: "pass" },
    cookies: { sessionID: 1 },
    redirectUrl: "/auth",
  }

  const res = {
    redirect: (url) => { redirectUrl = url },
    cookie: (key, value) => { cookies[key]= value},
    status: (code) => { statusCode = code; return res },
    json: (data) => { jsonResponse = data; },
  }

  test('Profile delete test', () => { 
    delete_(req, res)   
    expect(jsonResponse.redirectUrl).toBe('/auth')
  })

  test('Profile get data test', () => {
    getData(req, res)
    expect(jsonResponse).toStrictEqual({ username: "user", password: "pass" })
  })

  test('Profile update test', () => {
    update({cookies: { sessionID: 1 }, body: {newUsername: ''}}, res)
    expect(statusCode).toBe(-1)
  })

})

