import "dotenv/config";
import express from "express";

import {
  AgentCallbacks,
  FishjamAgent,
  FishjamClient,
  PeerOptions,
  RoomId,
} from "@fishjam-cloud/js-server-sdk";

const fishjamId = process.env.FISHJAM_ID!;
const managementToken = process.env.FISHJAM_MANAGEMENT_TOKEN!;

const fishjamClient = new FishjamClient({ fishjamId, managementToken });

const app = express();
app.use(express.json());
const port = 3000;

let agent1: FishjamAgent | null = null;
let agent2: FishjamAgent | null = null;

app.post("/join-room", async (req, res) => {
  try {
    const { roomId } = req.body;

    const room = await fishjamClient.getRoom(roomId as RoomId);

    const agentOptions = {
      subscribeMode: "auto",
      output: { audioFormat: "pcm16", audioSampleRate: 16000 },
    } satisfies PeerOptions;

    const agentCallbacks = {
      onError: console.error,
      onClose: (code, reason) => console.log("Agent closed", code, reason),
    } satisfies AgentCallbacks;

    const { agent: agent11 } = await fishjamClient.createAgent(
      room.id,
      agentOptions,
      agentCallbacks
    );

    const { agent: agent22 } = await fishjamClient.createAgent(
      room.id,
      agentOptions,
      agentCallbacks
    );

    agent1 = agent11;
    agent2 = agent22;

    console.log("agent1", agent1);
    console.log("agent2", agent2);

    agent1 = agent1.on("trackData", ({ track, peerId, data }) => {
      console.log("agent1 trackData", track, peerId, data);
    });

    agent2 = agent2.on("trackData", ({ track, peerId, data }) => {
      console.log("agent2 trackData", track, peerId, data);
    });

    res.json({
      roomId: room.id,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/leave-room", async (req, res) => {
  try {
    agent1?.disconnect();
    agent2?.disconnect();

    res.json({ message: "Room left" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
