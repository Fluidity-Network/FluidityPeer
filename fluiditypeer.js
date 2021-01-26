class FluidityPeer {
	constructor(id = "") {
		return new Promise((resolve, reject) => {
			if(id == "") {
				this.peer = new Peer();
			} else {
				this.peer = new Peer(id);
			}
			this.peer.on('open', (id) => {
				this.id = id;
				this.connections = [];
				this.onConnect = function(conn_id, peer_id) {}
				this.onReceive = function(data, conn_id, peer_id) {}
				this.encrypted = true;
				this.AESKey = null;
				this.tEnvoy = null;
				if(window.TogaTech != null) {
					this.tEnvoy = window.TogaTech.tEnvoy;
				}
				this.peer.on('connection', (conn) => {
					let fluidityConn = new FluidityConnection(conn);
					fluidityConn.onReceive = this.onReceive;
					fluidityConn.encrypted = this.encrypted;
					fluidityConn.AESKey = this.AESKey;
					fluidityConn.tEnvoy = this.tEnvoy;
					this.connections.push(fluidityConn);
					this.onConnect(fluidityConn.id, fluidityConn.peer);
				});
				resolve(this);
			});
		});
	}
	connect(id) {
		return new Promise((resolve, reject) => {
			let conn = this.peer.connect(id);
			conn.on('open', () => {
				let fluidityConn = new FluidityConnection(conn);
				fluidityConn.onReceive = this.onReceive;
				this.connections.push(fluidityConn);
				resolve(fluidityConn);
			});
		});
	}
	send(id, message) {
		return new Promise((resolve, reject) => {
			try {
				message = JSON.stringify(message);
			} catch(err) {
				
			}
			if(this.encrypted && this.AESKey != null && this.tEnvoy != null && this.tEnvoy.encrypt != null) {
				message = {
					encrypted: true,
					packet: this.tEnvoy.encrypt({
						AESKey: this.AESKey,
						string: message
					})
				};
			} else {
				message = {
					encrypted: false,
					packet: message
				}
			}
			let conn = this.connections.find(c => c.id == id);
			if(conn != null) {
				conn.send(message);
				resolve(true);
			} else {
				reject("No peer found!");
			}
		});
	}
	broadcast(message) {
		return new Promise(async (resolve, reject) => {
			for(let i = 0; i < this.connections.length; i++) {
				await this.send(this.connections[i].id, message);
			}
			resolve(true);
		});
	}
	close(id) {
		return new Promise((resolve, reject) => {
			let conn = this.connections.find(c => c.id == id);
			let connIndex = this.connections.indexOf(conn);
			if(conn != null) {
				conn.conn.close();
				connections.splice(connIndex, 1);
				resolve(true);
			} else {
				reject("No peer found!");
			}
		});
	}
}

class FluidityConnection {
	constructor(conn) {
		this.conn = conn;
		this.id = this.conn.connectionId;
		this.peer = this.conn.peer;
		this.onReceive = function(data, conn_id, peer_id) {}
		this.encrypted = true;
		this.AESKey = null;
		this.tEnvoy = null;
		if(window.TogaTech != null) {
			this.tEnvoy = window.TogaTech.tEnvoy;
		}
		conn.on('data', (data) => {
			this.onReceive(this.decryptReceive(data), this.id, this.peer);
		});
	}
	send(message) {
		this.conn.send(message);
	}
	decryptReceive(message) {
		if(message.encrypted && this.encrypted && this.AESKey != null && this.tEnvoy != null && this.tEnvoy.decrypt != null) {
			message = this.tEnvoy.decrypt({
				AESKey: this.AESKey,
				string: message.packet
			});
			try {
				message = JSON.parse(message);
			} catch(err) {

			}
		} else {
			message = message.packet;
		}
		return message;
	}
}