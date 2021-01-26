if(window.TogaTech == null) {
  window.TogaTech = {};
}
class tEnvoy {
  constructor() {
    
  }
  get version() {
    return "tEnvoy.1.cryptico.1"
  }
  basicRandomString(args) {
    if(args == null) {
      args = {};
    }
    if(typeof args == "string" || typeof args == "number") {
      args = {
        "length": args
      };
    }
    if(args.length == null) {
      args.length = 10;
    }
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < args.length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  sha256(args) {
    if(args == null) {
      args = {};
    }
    if(typeof args == "string") {
      args = {
        "string": args
      };
    }
    if(args.string == null) {
      throw "tEnvoy Fatal Error: property string of object args of method sha256 is required and does not have a default value.";
    }
    return SHA256(args.string);
  }
  sha1(args) {
    if(args == null) {
      args = {};
    }
    if(typeof args == "string") {
      args = {
        "string": args
      };
    }
    if(args.string == null) {
      throw "tEnvoy Fatal Error: property string of object args of method sha1 is required and does not have a default value.";
    }
    return SHA1(args.string);
  }
  md5(args) {
    if(args == null) {
      args = {};
    }
    if(typeof args == "string") {
      args = {
        "string": args
      };
    }
    if(args.string == null) {
      throw "tEnvoy Fatal Error: property string of object args of method md5 is required and does not have a default value.";
    }
    return MD5(args.string);
  }
  sha256Compound(args) {
    if(args == null) {
      args = {};
    }
    if(typeof args == "string") {
      args = {
        "string": args
      };
    }
    if(args.count == null) {
      args.count = 16;
    }
    if(isNaN(parseInt(args.count))) {
      args.count = 16;
    } else {
      args.count = parseInt(args.count);
    }
    if(args.string == null) {
      throw "tEnvoy Fatal Error: property string of object args of method sha256Compound is required and does not have a default value.";
    }
    let hash = args.string;
    for(let i = 0; i < args.count; i++) {
      hash = this.sha256({
        string: hash
      });
    }
    return hash;
  }
  sha256CompoundFromCredentials(args) {
    if(args == null) {
      args = {};
    }
    if(args.username == null) {
      args.username = "";
    }
    if(args.password == null) {
      args.password = "";
    }
    if(args.count == null) {
      args.count = 16;
    }
    if(isNaN(parseInt(args.count))) {
      args.count = 16;
    } else {
      args.count = parseInt(args.count);
    }
    return this.sha256Compound({
      string: this.genSeedFromCredentials({
        username: args.username,
        password: args.password
      }),
      count: args.count
    });
  }
  genKeys(args) {
    if(args == null) {
      args = {};
    }
    if(args.seed == null) {
      args.seed = this.basicRandomString({
        length: 16
      });
    }
    if(args.bits == null) {
      args.bits = 2048;
    }
    if(isNaN(parseInt(args.bits))) {
      args.bits = 2048;
    } else {
      args.bits = parseInt(args.bits);
    }
    return cryptico.generateRSAKey(args.seed, args.bits);
  }
  genSeedFromCredentials(args) {
    if(args == null) {
      args = {};
    }
    if(args.username == null) {
      args.username = "";
    }
    if(args.password == null) {
      args.password = "";
    }
    return args.username + args.password + this.sha256({
      string: args.username + args.password + this.md5({
        string: args.password
      }) + this.sha256({
        string: args.password
      }) + this.md5({
        string: args.username + args.password
      }) + this.sha256({
        string: this.sha256({
          string: args.username
        }) + this.sha256({
          string: args.password
        })
      })
    });
  }
  genKeysFromCredentials(args) {
    if(args == null) {
      args = {};
    }
    if(args.username == null) {
      args.username = "";
    }
    if(args.password == null) {
      args.password = "";
    }
    if(args.bits == null) {
      args.bits = 2048;
    }
    if(isNaN(parseInt(args.bits))) {
      args.bits = 2048;
    } else {
      args.bits = parseInt(args.bits);
    }
    return this.genKeys({
      seed: this.genSeedFromCredentials({
        username: args.username,
        password: args.password
      }),
      bits: args.bits
    });
  }
  genAESKey() {
    return cryptico.generateAESKey();
  }
  dumpKeysAsString(args) {
    if(args == null) {
      args = {};
    }
    if(args instanceof RSAKey) {
      args = {
        "privateKey": args
      };
    }
    if(args.keys != null) {
      args = {
        "privateKey": args.keys
      };
    }
    if(args.key != null) {
      args = {
        "privateKey": args.key
      };
    }
    if(args.privateKey == null) {
      throw "tEnvoy Fatal Error: property privateKey of object args of method dumpKeysAsString is required and does not have a default value.";
    }
    if(!(args.privateKey instanceof RSAKey)) {
      throw "tEnvoy Fatal Error: property privateKey of object args of method dumpKeysAsString is invalid.";
    }
    return JSON.stringify(args.privateKey);
  }
  loadKeysFromString(args) {
    if(args == null) {
      args = {};
    }
    if(typeof args == "string") {
      args = {
        "string": args
      };
    }
    if(args.string == null) {
      throw "tEnvoy Fatal Error: property string of object args of method loadKeysFromString is required and does not have a default value.";
    }
    let unformattedKeys = JSON.parse(args.string);
    let formattedKeys = new RSAKey();
    for(let prop in unformattedKeys) {
      if(typeof unformattedKeys[prop] == "object") {
        formattedKeys[prop] = new BigInteger();
        for(let int in unformattedKeys[prop]) {
          formattedKeys[prop][int] = unformattedKeys[prop][int];
        }
      } else {
        formattedKeys[prop] = unformattedKeys[prop];
      }
    }
    return formattedKeys;
  }
  publicKeyString(args) {
    if(args == null) {
      args = {};
    }
    if(args instanceof RSAKey) {
      args = {
        "privateKey": args
      };
    }
    if(args.keys != null) {
      args = {
        "privateKey": args.keys
      };
    }
    if(args.key != null) {
      args = {
        "privateKey": args.key
      };
    }
    if(args.privateKey == null) {
      throw "tEnvoy Fatal Error: property privateKey of object args of method publicKeyString is required and does not have a default value.";
    }
    if(!(args.privateKey instanceof RSAKey)) {
      throw "tEnvoy Fatal Error: property privateKey of object args of method publicKeyString is invalid.";
    }
    return cryptico.publicKeyString(args.privateKey);
  }
  publicKeyID(args) {
    if(args == null) {
      args = {};
    }
    if(typeof args == "string") {
      args = {
        "publicKey": args
      };
    }
    if(args instanceof RSAKey) {
      args = {
        "privateKey": args
      };
    }
    if(args.keys != null) {
      args = {
        "privateKey": args.keys
      };
    }
    if(args.key != null) {
      args = {
        "privateKey": args.key
      };
    }
    if(args.privateKey != null) {
      args = {
        "publicKey": this.publicKeyString({
          "privateKey": args.privateKey
        })
      };
    }
    if(args.publicKey == null) {
      throw "tEnvoy Fatal Error: property publicKey of object args of method publicKeyID is required and does not have a default value.";
    }
    return this.md5(args.publicKey);
  }
  publicKeyCode(args) {
    if(args == null) {
      args = {};
    }
    if(args.keys != null) {
      args = {
        "privateKey": args.keys
      };
    }
    if(args.key != null) {
      args = {
        "privateKey": args.key
      };
    }
    if(typeof args == "string") {
      if(args.length == 32) {
        args = {
          "publicKeyID": args
        };
      } else {
        args = {
          "publicKeyID": this.publicKeyID({
            "publicKey": args
          })
        };
      }
    }
    if(args instanceof RSAKey) {
      args = {
        "privateKey": args
      };
    }
    if(args.privateKey != null) {
      args = {
        "publicKeyID": this.publicKeyID({
          "privateKey": args.privateKey
        })
      };
    }
    if(args.publicKey != null) {
      args = {
        "publicKeyID": this.publicKeyID({
          "publicKey": args.publicKey
        })
      };
    }
    if(args.publicKeyID == null) {
      throw "tEnvoy Fatal Error: property publicKeyID of object args of method publicKeyCode is required and does not have a default value.";
    } else {
      return args.publicKeyID.match(/.{1,4}/g).join(" ");
    }
  }
  encrypt(args) {
    if(args == null) {
      args = {};
    }
    if(args.string == null) {
      throw "tEnvoy Fatal Error: property string of object args of method encrypt is required and does not have a default value.";
    }
    if(args.publicKey == null && args.AESKey == null) {
      throw "tEnvoy Fatal Error: property publicKey or AESKey of object args of method encrypt is required and does not have a default value.";
    }
    if(args.privateKey != null && !(args.privateKey instanceof RSAKey)) {
      throw "tEnvoy Fatal Error: property privateKey of object args of method encrypt is invalid.";
    }
    if(args.AESKey != null && !(args.AESKey instanceof Array && args.AESKey.length == 32)) {
      throw "tEnvoy Fatal Error: property AESKey of object args of method encrypt is invalid.";
    }
    if(args.AESKey != null) {
      return cryptico.encryptAESCBC(args.string, args.AESKey);
    }
    let encrypted;
    if(args.privateKey == null) {
      encrypted = cryptico.encrypt(args.string, args.publicKey);
    } else {
      encrypted = cryptico.encrypt(args.string, args.publicKey, args.privateKey);
    }
    if(encrypted.status == "success") {
      encrypted.string = encrypted.cipher;
      delete encrypted.cipher;
    }
    return encrypted;
  }
  decrypt(args) {
    if(args == null) {
      args = {};
    }
    if(args.string == null) {
      throw "tEnvoy Fatal Error: property string of object args of method decrypt is required and does not have a default value.";
    }
    if(args.keys != null) {
      args = {
        "privateKey": args.keys
      };
    }
    if(args.key != null) {
      args = {
        "privateKey": args.key
      };
    }
    if(args.privateKey == null && args.AESKey == null) {
      throw "tEnvoy Fatal Error: property privateKey or AESKey of object args of method decrypt is required and does not have a default value.";
    }
    if(args.privateKey != null && !(args.privateKey instanceof RSAKey)) {
      throw "tEnvoy Fatal Error: property privateKey of object args of method decrypt is invalid.";
    }
    if(args.AESKey != null && !(args.AESKey instanceof Array && args.AESKey.length == 32)) {
      throw "tEnvoy Fatal Error: property AESKey of object args of method decrypt is invalid.";
    }
    if(args.AESKey != null) {
      return cryptico.decryptAESCBC(args.string, args.AESKey);
    }
    let decrypted = cryptico.decrypt(args.string, args.privateKey);
    if(decrypted.status == "success") {
      decrypted.string = decrypted.plaintext;
      delete decrypted.plaintext;
    }
    return decrypted;
  }
  sign(args) {
    if(args == null) {
      args = {};
    }
    if(args.keys != null) {
      args = {
        "privateKey": args.keys
      };
    }
    if(args.key != null) {
      args = {
        "privateKey": args.key
      };
    }
    if(args.string == null) {
      throw "tEnvoy Fatal Error: property string of object args of method sign is required and does not have a default value.";
    }
    if(args.privateKey == null) {
      throw "tEnvoy Fatal Error: property privateKey of object args of method sign is required and does not have a default value.";
    }
    if(!(args.privateKey instanceof RSAKey)) {
      throw "tEnvoy Fatal Error: property privateKey of object args of method sign is invalid.";
    }
    let keys = this.genKeys();
    let encrypted = this.encrypt({
      string: args.string,
      publicKey: this.publicKeyString({
        privateKey: keys
      }),
      privateKey: args.privateKey
    });
    if(encrypted.status == "success") {
      encrypted.privateKey = keys;
    }
    return encrypted;
  }
  verifySignature(args) {
    if(args == null) {
      args = {};
    }
    if(args.keys != null) {
      args = {
        "privateKey": args.keys
      };
    }
    if(args.key != null) {
      args = {
        "privateKey": args.key
      };
    }
    if(args.string == null) {
      throw "tEnvoy Fatal Error: property string of object args of method verifySignature is required and does not have a default value.";
    }
    if(args.privateKey == null) {
      throw "tEnvoy Fatal Error: property privateKey of object args of method verifySignature is required and does not have a default value.";
    }
    if(!(args.privateKey instanceof RSAKey)) {
      throw "tEnvoy Fatal Error: property privateKey of object args of method verifySignature is invalid.";
    }
    return this.decrypt(args);
  }
}
window.TogaTech.tEnvoy = new tEnvoy();
console.log("%cPowered by TogaTech\n\n%cSTOP!%c\n\nTHE CONSOLE IS INTENDED FOR DEVELOPERS ONLY. USE AT YOUR OWN RISK.\n\nIf someone told you to type something here, perhaps to enable some hidden feature or hack, do NOT type it here. Doing so could send your password and sensitive data to hackers.\n\nTo learn more, please visit togatech.org/selfxss.", "", "color: red; font-size: 30px;", "font-size: 20px;");

