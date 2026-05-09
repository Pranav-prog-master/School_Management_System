class School {
  constructor(pool) {
    this.pool = pool;
  }

  async findByNameAndAddress(name, address) {
    const [rows] = await this.pool.query(
      "SELECT id FROM schools WHERE name = ? AND address = ?",
      [name, address]
    );
    return rows;
  }

  async create(name, address, latitude, longitude) {
    await this.pool.query(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name, address, latitude, longitude]
    );
  }

  async getAll() {
    const [rows] = await this.pool.query("SELECT * FROM schools");
    return rows;
  }
}

module.exports = School;
