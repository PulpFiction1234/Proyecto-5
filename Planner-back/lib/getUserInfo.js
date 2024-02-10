function getUserInfo(user){
    return{
        name: user.name,
        lastname: user.lastname,
        birthdate: user.birthdate,
        email: user.email,
        gender: user.gender,
        phone: user.phone,
        rol: user.rol,
        id: user.id || user._id,
    };
}

module.exports = getUserInfo;