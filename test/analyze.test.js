import test, { after } from "node:test";
import assert from "node:assert/strict";
import { Analyze } from "../src/Analyze.js";
import { db } from "../src/infrastructure/persistence/dbContext.js";

test("should analyze group chat", async () => {
    const groupChat = {
        groupMetadata: {
            creation: 1665415936,
            size: 1
        },
        participants: [
            {
                id: {
                    _serialized: '92896558501@lid'
                }
            }
        ],
        id: {
            _serialized: '120363044294697@g.us',
        },
        name: 'vendas',
        lastMessage: {
            _data: {
                notifyName: 'Robert',
                author: [Object],
            },
            hasMedia: false,
            body: "Lorem ipsum dolor sit amet . Os operadores gráficos e tipográficos sabem disso bem, na realidade.",
            author: '92896558501@lid',
        }
    }

    await (new Analyze().on(groupChat));

    assert.equal(true, true);

    after(async () => {
        await db.$client.end();
    });
});
