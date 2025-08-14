import * as dotenv from 'dotenv';

dotenv.config();

interface PlayerConfig {
  fifaVersion: string;
  fifaUpdate: string;
}

const playerConfig: PlayerConfig = {
  fifaVersion: process.env.FIFA_VERSION ?? "15",
  fifaUpdate: process.env.FIFA_UPDATE ?? "2",
};

export default playerConfig;
