/* eslint-disable import/no-unresolved */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */

const NodeEnvironment = require("jest-environment-node");
const { randomUUID } = require("crypto");
const util = require("util");

const { PrismaClient } = require("@prisma/client");

const exec = util.promisify(require("child_process").exec);

class PrismaTestEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);

    this.schema = `test_${randomUUID()}`;
    this.client = new PrismaClient();
    this.connectionString = `${process.env.DATABASE_URL_TEST}${this.schema}`;
  }

  async setup() {
    process.env.DATABASE_URL = this.connectionString;
    this.global.process.env.DATABASE_URL = this.connectionString;

    await exec(`yarn prisma migrate dev`);

    return super.setup();
  }

  async teardown() {
    await this.client.$executeRawUnsafe(
      `drop schema if exists "${this.schema}" cascade`
    );

    await this.client.$disconnect();
  }
}

module.exports = PrismaTestEnvironment;
