import jwt from 'jsonwebtoken'

const accessToken = (user: string) => {
  const accessToken = jwt.sign({ userId: user }, process.env.SECRET_KEY!, {
    expiresIn: '15m',
  })
  return accessToken
}

const refreshToken = (user: string) => {
  const refreshToken = jwt.sign({ userId: user }, process.env.SECRET_KEY!, {
    expiresIn: '7d',
  })
  return refreshToken
}

export { accessToken, refreshToken }
