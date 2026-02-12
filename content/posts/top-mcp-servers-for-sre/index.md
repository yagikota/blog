---
title: "Top MCP Servers for Site Reliability Engineers (SRE) and How to Set Them Up in Cursor"
date: 2026-02-13
draft: false
summary: "A practical guide to using Model Context Protocol (MCP) servers in Cursor for SRE workflows — incident response, log analysis, infra troubleshooting, and documentation search."
description: "Introduce MCP servers for SREs, recommend useful servers (GitHub, PagerDuty, Honeycomb, Axiom, Sentry, AWS), and provide step-by-step Cursor setup instructions with configuration examples."
tags: ["MCP", "SRE", "Cursor", "AI", "DevOps", "Observability"]
categories: ["Development"]
series: []
showTableOfContents: true
---

## Introduction

Site Reliability Engineers spend a lot of time context-switching: between logs, dashboards, runbooks, incident tools, and code. The more you can bring these together, the faster you can respond to incidents and improve reliability.

**Model Context Protocol (MCP)** lets AI assistants in Cursor connect directly to your tools and data sources. Instead of copying logs into a chat or describing your infrastructure from memory, the model can fetch live data, run queries, and take actions on your behalf.

### Why MCP Matters for SRE

- **Faster incident response**: Ask "What are the open PagerDuty incidents?" or "Show me the last 100 errors from Sentry" and get real answers without leaving the editor.
- **Reduced context-switching**: Correlate deployments, logs, and incidents in one conversation.
- **AI-assisted runbooks**: The model can read your runbooks, query systems, and guide you through steps.
- **Documentation at your fingertips**: Search Confluence, Notion, or internal docs from chat.

### How AI + Tools Improve Reliability Work

Without MCP, the model only has what you paste into the chat. It can't access your PagerDuty, query your logs, or check GitHub deploy status. With MCP, it gains **tools** — functions that call real APIs. The model decides when to use them and interprets the results. That turns a generic chat into an SRE copilot that can actually see your systems.

---

## What is MCP (Model Context Protocol)?

### Simple Explanation

MCP is an open protocol that lets AI assistants connect to external tools and data sources — APIs, databases, CLIs, and more — through a standardized interface. Think of it as a plugin system: each **MCP server** exposes capabilities, and clients like Cursor can discover and invoke them.

### How MCP Servers Work

MCP servers expose three kinds of capabilities:

| Capability | Description |
| --- | --- |
| **Tools** | Functions the model can call (e.g., "list_incidents", "query_logs") |
| **Resources** | Structured data the model can read (e.g., dashboards, configs) |
| **Prompts** | Reusable prompt templates for common workflows |

Cursor communicates with MCP servers via:

- **stdio**: A local process (e.g., `npx mcp-server`) that Cursor spawns and talks to over stdin/stdout
- **SSE** or **Streamable HTTP**: Remote servers that Cursor connects to over the network

Flow: _You ask a question → Cursor invokes an MCP tool → The server runs the operation → The response goes back to the model → The model answers you._

### MCP vs Normal LLM Usage

| Without MCP | With MCP |
| --- | --- |
| Model only has your prompt and any files you attach | Model can call tools to fetch live data |
| You must manually copy logs, errors, or API responses | Model can query Sentry, PagerDuty, logs, etc. itself |
| Answers are based on general knowledge | Answers are based on *your* actual systems and data |

Example: "Why did our API latency spike at 2pm?" — Without MCP, the model guesses. With MCP + Honeycomb or Axiom, it can run a query and reason over real traces and logs.

---

## Recommended MCP Servers for SRE

Below are MCP servers that fit SRE workflows. All are available in the [Cursor MCP Directory](https://cursor.com/docs/context/mcp/directory) or [MCP Registry](https://registry.modelcontextprotocol.io/). For each, we list what it does, why it's useful for SRE, and example use cases.

### GitHub MCP Server

| | |
| --- | --- |
| **What it does** | Integrates with GitHub: repos, issues, PRs, file operations |
| **Why useful for SRE** | Runbooks, config-as-code, and deployment metadata live in GitHub. During incidents, you can correlate deployments, check PR diffs, and read runbooks without leaving Cursor. |
| **Example use cases** | "What changed in the last deploy?", "Show me the runbook for database failover", "List open PRs for the infra team" |
| **Link** | [GitHub MCP](https://github.com/github/github-mcp-server) |

### PagerDuty MCP Server

| | |
| --- | --- |
| **What it does** | Integrates with PagerDuty: list incidents, acknowledge, escalate, add notes |
| **Why useful for SRE** | Manage incidents directly from chat while on-call. The model can summarize status, acknowledge alerts, or escalate based on your instructions. |
| **Example use cases** | "List open PagerDuty incidents", "Acknowledge incident INC-123", "Summarize incidents from the last 24 hours" |
| **Link** | [Cursor MCP Directory - PagerDuty](https://cursor.com/docs/context/mcp/directory) |

### incident.io MCP Server

| | |
| --- | --- |
| **What it does** | Incident management: create incidents, update status pages, postmortems |
| **Why useful for SRE** | Lightweight incident management. If you use incident.io, you can create incidents, update status, and trigger workflows from Cursor. |
| **Example use cases** | "Create an incident for the payment service outage", "Update status page to 'Investigating'" |
| **Link** | [incident.io](https://incident.io) |

### Honeycomb MCP Server

| | |
| --- | --- |
| **What it does** | Query Honeycomb traces, SLOs, and observability data in natural language |
| **Why useful for SRE** | Debug latency spikes, trace errors, and check SLO compliance without leaving the IDE. |
| **Example use cases** | "What caused the slowest 1% of requests in the last hour?", "Show me traces for endpoint /api/orders", "What's our current error rate SLO?" |
| **Link** | [Honeycomb](https://www.honeycomb.io) |

### Axiom MCP Server

| | |
| --- | --- |
| **What it does** | Log analytics and APL (Axiom Query Language) queries |
| **Why useful for SRE** | Run log queries against Axiom from chat. Perfect for debugging production issues and correlating logs with code changes. |
| **Example use cases** | "Search logs for 'connection refused' in the last 30 minutes", "Aggregate errors by service in the last hour" |
| **Link** | [Axiom](https://axiom.co) |

### Sentry MCP Server

| | |
| --- | --- |
| **What it does** | Error tracking and performance monitoring |
| **Why useful for SRE** | Fetch errors, stack traces, and performance data. Correlate with deployments and code changes. |
| **Example use cases** | "Show me the top 5 errors in the last hour", "What's the error rate for service X?", "Get the stack trace for issue ABC-123" |
| **Link** | [Sentry](https://sentry.io) |

### AWS MCP Server

| | |
| --- | --- |
| **What it does** | Access AWS services through natural language |
| **Why useful for SRE** | Inspect EKS, RDS, Lambda, CloudWatch, and other resources. Useful for infra troubleshooting and understanding cloud state. |
| **Example use cases** | "List EKS pods in the production cluster", "Describe RDS instance status", "Check CloudWatch alarms for API" |
| **Link** | [Cursor MCP Directory - AWS](https://cursor.com/docs/context/mcp/directory) |

### Elasticsearch MCP Server

| | |
| --- | --- |
| **What it does** | Query logs and data from the ELK stack (Elasticsearch, Kibana, OpenSearch) |
| **Why useful for SRE** | Run log queries against Elasticsearch during incidents. Useful if you use ELK or OpenSearch. |
| **Example use cases** | "Search logs for 'timeout' in the last hour", "Aggregate errors by pod" |
| **Link** | [Cursor MCP Directory - Elasticsearch](https://cursor.com/docs/context/mcp/directory) |

### Notion / Atlassian MCP Servers

| | |
| --- | --- |
| **What it does** | Search and read Notion pages or Confluence/Jira content |
| **Why useful for SRE** | Runbooks, architecture docs, and playbooks often live in Notion or Confluence. The model can search and surface them. |
| **Example use cases** | "Find the runbook for Redis cache failure", "Search Confluence for 'database migration'" |
| **Link** | [Notion](https://notion.so), [Atlassian MCP](https://www.atlassian.com/platform/remote-mcp-server) |

### Bringing IaC and Kubernetes into Context

**Terraform / IaC**: There's no dedicated Terraform MCP in Cursor's directory yet. In the meantime, use the [Filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem) or [Git](https://github.com/modelcontextprotocol/servers/tree/main/src/git) MCP from the official [modelcontextprotocol/servers](https://github.com/modelcontextprotocol/servers) repo to read Terraform files from your workspace. Terraform-specific MCP servers may appear in the [MCP Registry](https://registry.modelcontextprotocol.io/) — check there for updates.

**Kubernetes**: For EKS, the [AWS MCP](https://cursor.com/docs/context/mcp/directory) covers many cluster operations. For GKE, see [Google's MCP servers](https://github.com/google/mcp). For community Kubernetes MCP servers, browse the [MCP Registry](https://registry.modelcontextprotocol.io/).

---

## How to Set Up MCP Servers in Cursor

### Prerequisites

- **Node.js** (for `npx`-based servers)
- **Docker** (for some servers, e.g., GitHub)
- **Cursor IDE** (with MCP support)
- **API keys / tokens** for your services (GitHub, PagerDuty, Axiom, etc.)

### Configuration Locations

| Scope | Location |
| --- | --- |
| **Global** (all projects) | `~/.cursor/mcp.json` (macOS/Linux), `%APPDATA%\Cursor\mcp.json` (Windows) |
| **Project** (team-shared) | `.cursor/mcp.json` in your project root |

### Example `mcp.json`

Create or edit `~/.cursor/mcp.json` with your desired servers:

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "-e", "GITHUB_PERSONAL_ACCESS_TOKEN", "ghcr.io/github/github-mcp-server"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${env:GITHUB_TOKEN}"
      }
    },
    "pagerduty": {
      "command": "uvx",
      "args": ["pagerduty-mcp", "--enable-write-tools"],
      "env": {
        "PAGERDUTY_USER_API_KEY": "${env:PAGERDUTY_API_KEY}",
        "PAGERDUTY_API_HOST": "https://api.pagerduty.com"
      }
    },
    "axiom": {
      "url": "https://mcp.axiom.co/mcp",
      "headers": {
        "Authorization": "Bearer ${env:AXIOM_TOKEN}"
      }
    }
  }
}
```

For STDIO servers (local processes), use `command` and `args`. For remote servers, use `url` and `headers`. Use `${env:VAR_NAME}` to pass secrets from your environment instead of hardcoding them.

### Step-by-Step Setup

1. **Create the config file**
   Create `~/.cursor/mcp.json` (or `.cursor/mcp.json` in your project).

2. **Add server entries**
   Copy the example above and add or remove servers for your stack. Ensure each server has the correct `command`/`args` or `url`/`headers`.

3. **Set environment variables**
   Export the required tokens before launching Cursor, for example:
   ```bash
   export GITHUB_TOKEN="ghp_..."
   export PAGERDUTY_API_KEY="..."
   export AXIOM_TOKEN="..."
   ```

4. **Restart Cursor**
   Reload the window (Cmd+Shift+P → "Developer: Reload Window") or restart Cursor so it picks up the new config.

5. **Verify**
   Go to **Settings → Tools & MCP** and confirm your servers appear. In chat, enable the tools you want the model to use.

### Minimal Config Example

A simple starter configuration using `npx`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "${env:GITHUB_TOKEN}"
      }
    },
    "kubernetes": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-kubernetes"]
    }
  }
}
```

Package names may vary. For Kubernetes, you may need the [AWS MCP](https://cursor.com/docs/context/mcp/directory) (for EKS) or community servers from the [MCP Registry](https://registry.modelcontextprotocol.io/). Always check the [Cursor MCP Directory](https://cursor.com/docs/context/mcp/directory) for the exact install commands per server.

---

## Best Practices and Security

MCP servers can access external services and execute operations on your behalf. Treat them with care.

| Practice | Description |
| --- | --- |
| **Verify sources** | Prefer servers from the [Cursor MCP Directory](https://cursor.com/docs/context/mcp/directory) or trusted providers. Avoid installing from unknown sources. |
| **Review permissions** | Understand what APIs and data each server accesses. |
| **Limit API keys** | Use scoped tokens (e.g., read-only for logs, minimal repo access for GitHub). |
| **Prefer project config** | Use `.cursor/mcp.json` in repos for team consistency; keep secrets in env vars, not in the config file. |
| **Audit for critical use** | For production systems, review the server's source code when possible. |

For more details, see [Cursor's security considerations](https://cursor.com/docs/context/mcp#security-considerations).

---

## Conclusion and Future Outlook

MCP gives SREs a way to combine AI assistance with live tooling (GitHub, PagerDuty, logs, cloud APIs) directly in Cursor. Instead of juggling between tools, you can ask questions and get answers backed by real data.

Expect more SRE-focused servers over time — Datadog, Grafana, Terraform, and dedicated Kubernetes MCP servers may appear. The [MCP Registry](https://registry.modelcontextprotocol.io/) and [Cursor MCP Directory](https://cursor.com/docs/context/mcp/directory) are the best places to discover new integrations.

If you have feedback or runbook ideas, share them. The MCP ecosystem is evolving quickly, and SRE use cases are a natural fit.
