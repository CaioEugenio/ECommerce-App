const fs = require("fs");
const crypto = require("crypto");

class UsersRepository {
  constructor(filename) {
    if (!filename) {
      throw new Error("Creating a new repository requires a filename");
    }

    this.filename = filename;

    try {
      fs.accessSync(this.filename);
    } catch (err) {
      fs.writeFileSync(this.filename, "[]");
    }
  }

  async getAll() {
    return JSON.parse(
      await fs.promises.readFile(this.filename, { encoding: "utf8" })
    );
  }

  async create(attrs) {
    attrs.id = this.randomId();

    const records = await this.getAll();
    records.push(attrs);

    await this.writeAll(records);
  }

  async writeAll(records) {
    await fs.promises.writeFile(
      this.filename,
      JSON.stringify(records, null, 2)
    );
  }

  randomId() {
    return crypto.randomBytes(4).toString("hex");
  }

  async getOne(id) {
    const records = await this.getAll();
    return records.find((record) => id === record.id);
  }

  async delete(id) {
    const records = await this.getAll();
    console.log(records);
    const filteredRecords = records.filter((record) => record.id !== id);
    console.log(filteredRecords);
    await this.writeAll(filteredRecords);
  }

  async update(id, attrs) {
    const records = await this.getAll();
    const record = records.find((record) => id === record.id);
    if (!record) {
      throw new Error(`Record with id ${id} not found`);
    }

    Object.assign(record, attrs);
    await this.writeAll(records);
  }
}
const test = async () => {
  const repo = new UsersRepository("users.json");
  await repo.create({ email: "hahaha", password: "lololol" });
  //const user = await repo.getOne("ec00fcbe");
  //await repo.delete("1d8a2a27");
  await repo.update("20c47ed4", { email: "ffffffffff" });
  const user = await repo.getOne("20c47ed4");
  console.log(user);
};

test();
