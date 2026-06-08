import bcrypt from 'bcrypt'

const saltRound:number = parseInt(process.env.SALT_ROUDS!)

const hashPassword = async(password: string)=>{
    const passwordHashed =  await bcrypt.hash(password, saltRound)

    return passwordHashed
}

const validatePassword = async(password:string, hash:string) =>{
    const plainPassword = await bcrypt.compare(password,hash)
    
    return plainPassword
}

export {hashPassword, validatePassword}