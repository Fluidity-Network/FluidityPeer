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
				this.peer.on('connection', (conn) => {
					let fluidityConn = new FluidityConnection(conn);
					fluidityConn.onReceive = this.onReceive;
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
			let conn = this.connections.find(c => c.id == id);
			if(conn != null) {
				conn.send(message);
				resolve(true);
			} else {
				this.connect(id);
				conn = this.connections.find(c => c.id == id);
				if(conn != null) {
					conn.send(message);
					resolve(true);
				} else {
					reject("No peer found!");
				}
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
		conn.on('data', (data) => {
			this.onReceive(data, this.id, this.peer);
		});
	}
	send(message) {
		this.conn.send(message);
	}
}