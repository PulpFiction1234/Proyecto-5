const Mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { generateAccessToken, generateRefreshToken } = require("../auth/sign");
const getUserInfo = require("../lib/getUserInfo");
const Token = require("../schema/token");
const Schema = Mongoose.Schema;


const UserSchema = new Schema({
    id: { type: Object},
    name: { 
        type: String, 
        required: true, 
        trim: true},
    lastname: {
        type: String, 
        required: true, 
        trim: true
      },
    email: {
        type: String, 
        required: true,
        trim: true, 
        match: [/.+\@.+\..+/, 'Por favor ingrese un correo válido'], 
        lowercase:true , 
        unique: true
      },
    birthdate: {
        type: Date, 
        required: true
      },
    password: {
        type: String, 
        required: true, 
        trim: true
      },
    phone: {
        type: String, 
        required: true, 
        trim: true
      },
    direccion:{
        type: String,
        trim: true
      },
    rut: {
      type: String,
      unique: true,
      match: [/^\d{7,8}-[kK\d]$/, 'Por favor ingrese un RUT válido']
    },
    rol:{
      type: String,
      enum: ['usuario','admin','profecional'],
      default: 'usuario'
    },
    estadoCuenta:{
      type: String,
      enum: ['inactivo', 'activo','suspendido'],
      default: 'inactivo'
    },
    ultimaAtencion:{
      type: Date,
      default: Date.now
    },
    tarjetaAsociada:[
      {
        type: String
      }
    ],
    historialDeCompra:[
      {
        compraID: Schema.Types.ObjectId
      }
    ]
});

UserSchema.pre("save", function (next) {
    if (this.isModified("password") || this.isNew) {
      const document = this;
  
      bcrypt.hash(document.password, 10, (err, hash) => {
        if (err) {
          next(err);
        } else {
          document.password = hash;
          next();
        }
      });
    } else {
      next();
    }
  });
  
  UserSchema.methods.emailExists = async function (email) {
    const result = await Mongoose.model("User").find({ email: email });
    return result.length > 0;
  };
  
  UserSchema.methods.isCorrectPassword = async function (password, hash) {
    console.log(password, hash);
    const same = await bcrypt.compare(password, hash);
  
    return same;
  };
  
  UserSchema.methods.createAccessToken = function () {
    return generateAccessToken(getUserInfo(this));
  };
  
  UserSchema.methods.createRefreshToken = async function (next) {
    const refreshToken = generateRefreshToken(getUserInfo(this));
  
    console.error("refreshToken", refreshToken);
  
    try {
      await new Token({ token: refreshToken }).save();
      console.log("Token saved", refreshToken);
      return refreshToken;
    } catch (error) {
      console.error(error);
      next(new Error("Error creating token"));
    }
  };
  
  module.exports = Mongoose.model("User", UserSchema);