#!/usr/bin/env node
'use strict';

/**
 * Creates the four tables Sample Trail writes to, on your own n8n, and seeds the specification
 * library with four worked examples.
 *
 * This exists because the store that needs no credential is otherwise the most tedious to set up:
 * fifty three columns typed by hand across four tables, where one wrong name means a node writes
 * into nothing. The spreadsheet paths have sheets/*.csv; this is the same thing for Data Tables.
 *
 * No dependencies, nothing to install. Node 20 or newer.
 *
 *   N8N_URL=https://your-n8n N8N_API_KEY=... node setup.js
 *   node setup.js --no-seed     create the tables, leave them empty
 *   node setup.js --list        print the ids of tables that already exist
 *
 * Idempotent: it creates what is missing and leaves what exists alone. It never drops a column,
 * because dropping one would take an audit record with it.
 *
 * The ids it prints go into the Settings node of each workflow.
 */

const TABLES = [
  {
    "key": "register",
    "name": "sample_trail_register",
    "columns": [
      "sample_id",
      "lot_ref",
      "contract_ref",
      "commodity",
      "origin",
      "shipper",
      "spec_id",
      "dispatch_ts",
      "dispatch_photo",
      "carrier_ref",
      "receipt_ts",
      "receipt_condition",
      "receipt_photo",
      "sla_due_ts",
      "eval_ts",
      "evaluator",
      "input_type",
      "input_url",
      "transcript",
      "extracted_json",
      "verdict",
      "verdict_reasons",
      "decision",
      "decision_by",
      "decision_ts",
      "decision_note",
      "status"
    ]
  },
  {
    "key": "spec",
    "name": "sample_trail_spec",
    "columns": [
      "spec_id",
      "contract_ref",
      "commodity",
      "param",
      "label",
      "unit",
      "check",
      "direction",
      "threshold",
      "values",
      "tolerance_pct",
      "required",
      "notes"
    ]
  },
  {
    "key": "log",
    "name": "sample_trail_log",
    "columns": [
      "ts",
      "sample_id",
      "actor",
      "action",
      "from_status",
      "to_status",
      "note"
    ]
  },
  {
    "key": "counterparty",
    "name": "sample_trail_counterparty",
    "columns": [
      "contract_ref",
      "shipper",
      "shipper_email",
      "customer",
      "customer_email",
      "notes"
    ]
  }
];

/**
 * Four specifications, one per commodity, as worked examples. Every counterparty here is invented.
 * Delete them once you have added your own contracts, or leave them: a sample is only ever judged
 * against the spec_id its own row names.
 */
const SPEC_SEED = [
  {
    "spec_id": "SP-COF-01",
    "contract_ref": "CT-9902",
    "commodity": "Coffee",
    "param": "moisture_pct",
    "label": "Moisture",
    "unit": "%",
    "check": "numeric",
    "direction": "max",
    "threshold": "12.0",
    "values": "",
    "tolerance_pct": "2",
    "required": "yes",
    "notes": ""
  },
  {
    "spec_id": "SP-COF-01",
    "contract_ref": "CT-9902",
    "commodity": "Coffee",
    "param": "defect_count",
    "label": "Defect count",
    "unit": "",
    "check": "numeric",
    "direction": "max",
    "threshold": "5",
    "values": "",
    "tolerance_pct": "",
    "required": "yes",
    "notes": "full defects per 300g sample"
  },
  {
    "spec_id": "SP-COF-01",
    "contract_ref": "CT-9902",
    "commodity": "Coffee",
    "param": "grade_score",
    "label": "Grade score",
    "unit": "",
    "check": "numeric",
    "direction": "min",
    "threshold": "82",
    "values": "",
    "tolerance_pct": "",
    "required": "yes",
    "notes": ""
  },
  {
    "spec_id": "SP-COF-01",
    "contract_ref": "CT-9902",
    "commodity": "Coffee",
    "param": "defects",
    "label": "Excluded conditions",
    "unit": "",
    "check": "absent",
    "direction": "",
    "threshold": "",
    "values": "mould, taint, live infestation",
    "tolerance_pct": "",
    "required": "yes",
    "notes": "no tolerance applies to an exclusion"
  },
  {
    "spec_id": "SP-GRN-01",
    "contract_ref": "CT-7714",
    "commodity": "Grain",
    "param": "moisture_pct",
    "label": "Moisture",
    "unit": "%",
    "check": "numeric",
    "direction": "max",
    "threshold": "14.0",
    "values": "",
    "tolerance_pct": "2",
    "required": "yes",
    "notes": ""
  },
  {
    "spec_id": "SP-GRN-01",
    "contract_ref": "CT-7714",
    "commodity": "Grain",
    "param": "foreign_matter_pct",
    "label": "Foreign matter",
    "unit": "%",
    "check": "numeric",
    "direction": "max",
    "threshold": "2.0",
    "values": "",
    "tolerance_pct": "",
    "required": "yes",
    "notes": ""
  },
  {
    "spec_id": "SP-GRN-01",
    "contract_ref": "CT-7714",
    "commodity": "Grain",
    "param": "protein_pct",
    "label": "Protein",
    "unit": "%",
    "check": "numeric",
    "direction": "min",
    "threshold": "11.5",
    "values": "",
    "tolerance_pct": "",
    "required": "yes",
    "notes": ""
  },
  {
    "spec_id": "SP-GRN-01",
    "contract_ref": "CT-7714",
    "commodity": "Grain",
    "param": "defects",
    "label": "Excluded conditions",
    "unit": "",
    "check": "absent",
    "direction": "",
    "threshold": "",
    "values": "mould, live infestation",
    "tolerance_pct": "",
    "required": "yes",
    "notes": ""
  },
  {
    "spec_id": "SP-COC-01",
    "contract_ref": "CT-5521",
    "commodity": "Cocoa",
    "param": "moisture_pct",
    "label": "Moisture",
    "unit": "%",
    "check": "numeric",
    "direction": "max",
    "threshold": "7.5",
    "values": "",
    "tolerance_pct": "3",
    "required": "yes",
    "notes": ""
  },
  {
    "spec_id": "SP-COC-01",
    "contract_ref": "CT-5521",
    "commodity": "Cocoa",
    "param": "bean_count_per_100g",
    "label": "Bean count per 100g",
    "unit": "",
    "check": "numeric",
    "direction": "max",
    "threshold": "100",
    "values": "",
    "tolerance_pct": "",
    "required": "yes",
    "notes": ""
  },
  {
    "spec_id": "SP-COC-01",
    "contract_ref": "CT-5521",
    "commodity": "Cocoa",
    "param": "defects",
    "label": "Excluded conditions",
    "unit": "",
    "check": "absent",
    "direction": "",
    "threshold": "",
    "values": "mould, smoke taint, slaty beans",
    "tolerance_pct": "",
    "required": "yes",
    "notes": ""
  },
  {
    "spec_id": "SP-NUT-01",
    "contract_ref": "CT-3308",
    "commodity": "Nuts",
    "param": "moisture_pct",
    "label": "Moisture",
    "unit": "%",
    "check": "numeric",
    "direction": "max",
    "threshold": "6.0",
    "values": "",
    "tolerance_pct": "",
    "required": "yes",
    "notes": ""
  },
  {
    "spec_id": "SP-NUT-01",
    "contract_ref": "CT-3308",
    "commodity": "Nuts",
    "param": "oil_content_pct",
    "label": "Oil content",
    "unit": "%",
    "check": "numeric",
    "direction": "min",
    "threshold": "60",
    "values": "",
    "tolerance_pct": "",
    "required": "yes",
    "notes": ""
  },
  {
    "spec_id": "SP-NUT-01",
    "contract_ref": "CT-3308",
    "commodity": "Nuts",
    "param": "trash_pct",
    "label": "Trash content",
    "unit": "%",
    "check": "numeric",
    "direction": "max",
    "threshold": "3",
    "values": "",
    "tolerance_pct": "",
    "required": "no",
    "notes": "reported when a reading is taken"
  },
  {
    "spec_id": "SP-NUT-01",
    "contract_ref": "CT-3308",
    "commodity": "Nuts",
    "param": "defects",
    "label": "Excluded conditions",
    "unit": "",
    "check": "absent",
    "direction": "",
    "threshold": "",
    "values": "mould, rancidity, live infestation",
    "tolerance_pct": "",
    "required": "yes",
    "notes": ""
  }
];

const COUNTERPARTY_SEED = [
  {
    "contract_ref": "CT-9902",
    "shipper": "Northwind Produce Ltd",
    "shipper_email": "dispatch@northwind.example.invalid",
    "customer": "Harbour Roasting Co",
    "customer_email": "quality@harbour-roasting.example.invalid",
    "notes": ""
  },
  {
    "contract_ref": "CT-7714",
    "shipper": "Meridian Agri Trading",
    "shipper_email": "samples@meridian-agri.example.invalid",
    "customer": "Inland Mills",
    "customer_email": "intake@inland-mills.example.invalid",
    "notes": ""
  },
  {
    "contract_ref": "CT-5521",
    "shipper": "Cape Fortuna Exports",
    "shipper_email": "quality@cape-fortuna.example.invalid",
    "customer": "Rivermouth Confectionery",
    "customer_email": "buying@rivermouth.example.invalid",
    "notes": ""
  },
  {
    "contract_ref": "CT-3308",
    "shipper": "Trade Winds Nut Co",
    "shipper_email": "exports@tradewinds-nut.example.invalid",
    "customer": "Bellweather Foods",
    "customer_email": "procurement@bellweather.example.invalid",
    "notes": ""
  }
];

function config() {
  let url = String(process.env.N8N_URL || '');
  while (url.endsWith('/')) url = url.slice(0, -1);
  const key = process.env.N8N_API_KEY || '';
  if (!url || !key) {
    console.error('Set N8N_URL and N8N_API_KEY first.');
    console.error('An API key comes from Settings, n8n API, in your own instance.');
    process.exit(1);
  }
  return { base: url + '/api/v1', key };
}

async function api(cfg, method, route, body) {
  const res = await fetch(cfg.base + route, {
    method,
    headers: Object.assign({ 'X-N8N-API-KEY': cfg.key }, body ? { 'Content-Type': 'application/json' } : {}),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(method + ' ' + route + ' returned ' + res.status + ': ' + text.slice(0, 300));
  return text ? JSON.parse(text) : null;
}

async function main() {
  const args = process.argv.slice(2);
  const cfg = config();

  const existing = {};
  const found = await api(cfg, 'GET', '/data-tables?limit=200');
  for (const table of found.data || []) existing[table.name] = table.id;

  if (args.includes('--list')) {
    for (const t of TABLES) console.log(t.key.padEnd(14) + t.name.padEnd(28) + (existing[t.name] || '(missing)'));
    return;
  }

  const ids = {};
  for (const table of TABLES) {
    if (existing[table.name]) {
      ids[table.key] = existing[table.name];
      console.log(table.name + ' exists  ' + existing[table.name]);
      continue;
    }
    // Every column is text. The workflow coerces at its own boundary, and a store that guesses at
    // types is a store that turns "12,5" into something nobody typed.
    const created = await api(cfg, 'POST', '/data-tables', {
      name: table.name,
      columns: table.columns.map((name) => ({ name, type: 'string' })),
    });
    ids[table.key] = created.id;
    console.log(table.name + ' created ' + created.id + '  ' + table.columns.length + ' columns');
  }

  if (!args.includes('--no-seed')) {
    for (const [key, seed, label] of [['spec', SPEC_SEED, 'specification rows'], ['counterparty', COUNTERPARTY_SEED, 'counterparties']]) {
      const rows = await api(cfg, 'GET', '/data-tables/' + ids[key] + '/rows?limit=1');
      if ((rows.data || []).length > 0) {
        console.log(label + ': already has rows, left alone');
        continue;
      }
      await api(cfg, 'POST', '/data-tables/' + ids[key] + '/rows', { data: seed });
      console.log(label + ': seeded ' + seed.length + ' rows');
    }
  }

  console.log('');
  console.log('Put these into the Settings node of each workflow:');
  for (const [key, id] of Object.entries(ids)) console.log('  ' + key + '_table_id = ' + id);
}

main().catch((err) => {
  console.error(err && err.message ? err.message : err);
  process.exitCode = 1;
});
