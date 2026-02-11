---
title: "Getting Started with Datadog Through the Datadog Learning Center"
date: 2024-06-30
draft: false
summary: "A hands-on walkthrough of the free Datadog Learning Center -- covering observability concepts, logs, metrics, integrations, and dashboards."
description: "An introduction to Datadog through the free Learning Center: observability fundamentals, metrics, traces, logs, monitors, SLOs, integrations, and dashboards."
tags: ["Datadog", "SRE", "observability", "monitoring"]
categories: ["Development"]
series: []
showTableOfContents: true
---

## Introduction

I needed to use Datadog at work but was a complete beginner and had to ramp up quickly. I decided to use the Datadog Learning Center to learn the basics. This post summarizes what I learned through the platform.

## Motivation

Two goals:

- Understand Datadog's core concepts
- Learn Datadog's basic operations

## What Is the Datadog Learning Center?

https://learn.datadoghq.com/

> Learn by coding on real cloud compute instances on our free interactive platform. Confidently monitor, scale, and secure your applications whether you're a beginner or an experienced developer, an operations pro, or a security expert.

In short, it's a free service that lets you learn Datadog's features through hands-on labs. Currently, 54 courses are available.
I started with the popular courses. Here's a quick overview of each:

![Popular courses on Datadog Learning Center (1)](course-overview1.png)
![Popular courses on Datadog Learning Center (2)](course-overview2.png)

*ref. [Introduction to Observability](https://learn.datadoghq.com/courses/introduction-to-observability), [Datadog Foundation](https://learn.datadoghq.com/courses/datadog-foundation), [Datadog 101: Developer](https://learn.datadoghq.com/courses/dd-101-dev)*

- **Introduction to Observability** -- Lecture-based
- **Datadog Foundation** -- Hands-on (SRE-focused)
- **Datadog 101: Developer** -- Hands-on (backend engineer-focused)

I decided to work through them top to bottom. This post covers Introduction to Observability and Datadog Foundation. (Datadog 101: Developer is left for future study.)

## Introduction to Observability

This section explains the fundamentals: what Datadog can do, and what Observability, Monitoring, Metrics, Traces, and Logs mean and why they matter.

| Concept | Description |
| --- | --- |
| Metrics | Quantitative data representing system state -- think of it as capturing "points" |
| Traces | Information about request paths and processing times -- think of it as capturing "lines" |
| Logs | Timestamped information about the system |
| Observability | Understanding *what* is happening and *why* from collected data |
| Monitoring | Collecting information to understand system state (a subset of Observability) |

The text can be hard to visualize, but this diagram makes it clear:

![Metrics, Traces, and Logs visualization](mtl.png)

*ref. [Macnica - Observability Overview](https://www.macnica.co.jp/en/business/security/manufacturers/splunk/blog_20230515.html)*

Datadog is an all-in-one observability tool that collects Metrics, Traces, and Logs. With Datadog, you can visualize them like this:

![Datadog's Metrics, Traces, and Logs](datadog-mtl.png)

*ref. [Datadog Learning Center - Monitoring vs Observability](https://learn.datadoghq.com/courses/take/introduction-to-observability/lessons/43691545-monitoring-vs-observability)*

In summary:

- Metrics → **what** is happening
- Traces → **where** it's happening
- Logs → **why** it's happening

These are the three pillars of observability, and Datadog provides tools to visualize all of them.

## Datadog Foundation

With the observability concepts understood, let's move on to Datadog's basic operations.

https://learn.datadoghq.com/courses/datadog-foundation

The course covers:

> - Describe the three different types of integrations
> - Understand the benefits of Universal Service Monitoring (USM) and Service Catalog
> - Search, filter, and query logs in the Log Explorer
> - Create a custom facet and a saved view
> - Visualize field aggregations
> - Search for metrics in the Metric Summary page
> - Graph metrics in the Metrics Explorer
> - Create a metric-based monitor
> - Create a monitor-based service level objective (SLO)
> - Clone an existing dashboard
> - Create a new dashboard
> - Copy widgets from dashboards
> - Add and configure new widgets

### Universal Service Monitoring

https://www.datadoghq.com/product/universal-service-monitoring/

Universal Service Monitoring (USM) is a Datadog feature that monitors your entire service *without any code changes*. Under the hood, it uses [eBPF](https://ebpf.io/what-is-ebpf/). To enable USM, you need to properly configure the [Datadog Agent](https://docs.datadoghq.com/agent/?tab=Linux) and [Unified Service Tagging](https://docs.datadoghq.com/getting_started/tagging/unified_service_tagging/?tab=kubernetes). Data collected by USM is viewable in the [Service Catalog](https://docs.datadoghq.com/service_catalog/).

As a side note, observability approaches can be broadly categorized into Push-based and Pull-based. Datadog uses an installed Agent, making it Push-based. An example of Pull-based is [Prometheus](https://prometheus.io/).

### Logs

https://docs.datadoghq.com/getting_started/logs/

Datadog centrally manages logs collected from multiple sources. Here's how the main operations work:

**Time Range**

Filter logs by time period.

![Log time range filter](log-time-range.png)

**Fields**

Filter which logs to display.

![Log fields filter](log-fields.png)

**Log Tags**

Each log has tags that can be used for filtering.

![Log tags](log-tag.png)

**Event Attributes**

View log attributes in JSON format.

![Log event attributes](log-event-attributes.png)

**Metrics**

Display metrics collected at log ingestion time.

![Log metrics](log-metrics.png)

**Custom Facets**

Create your own filtering criteria.

![Custom facets](log-custom-facets.png)

### Metrics

https://docs.datadoghq.com/getting_started/monitors/

In Datadog, metrics are represented as timestamp-value pairs. Closely related concepts include Monitors and Service Level Objectives (SLOs). Monitors send notifications when metrics fall outside defined thresholds. SLOs are indicators for quantitatively evaluating service quality, tracked over extended periods.

**Facet Panel and Metric Details Side Panel**

View detailed information about metrics.

![Metrics facet panel](metrics-facet.png)

**Metrics Visualization**

Visualize metrics as graphs.

![Metrics visualization (1)](metrics-viewer1.png)
![Metrics visualization (2)](metrics-viewer2.png)

**Creating a Metrics-Based Monitor**

Create a monitor based on a metric.

![Metrics-based monitor creation](metrics-monitor.png)

**Creating a Monitor-Based SLO**

Create an SLO based on a monitor.

![Monitor-based SLO creation](metrics-slo.png)

### Integrations

https://docs.datadoghq.com/getting_started/integrations/

Datadog has three integration types:

> - **Agent-based** integrations are installed with the Datadog Agent and use a Python class method called `check` to define the metrics to collect.
> - **Authentication (crawler) based** integrations are set up in [Datadog](https://app.datadoghq.com/account/settings) where you provide credentials for obtaining metrics with the API. These include popular integrations like [Slack](https://docs.datadoghq.com/integrations/slack/), [AWS](https://docs.datadoghq.com/integrations/amazon_web_services/), [Azure](https://docs.datadoghq.com/integrations/azure/), and [PagerDuty](https://docs.datadoghq.com/integrations/pagerduty/).
> - **Library** integrations use the [Datadog API](https://docs.datadoghq.com/api/) to allow you to monitor applications based on the language they are written in, like [Node.js](https://docs.datadoghq.com/integrations/node/) or [Python](https://docs.datadoghq.com/integrations/python/).

Details for each integration are available [here](https://docs.datadoghq.com/integrations/).

**Integration List and Configuration**

![Integration list](integration.png)

### Dashboards

https://docs.datadoghq.com/dashboards/

Dashboards are Datadog's flagship feature for displaying collected data in various formats -- charts, tables, notes, and more.

**Cloning a Dashboard**

Copy an existing dashboard to create a new one.

Source dashboard:
![Dashboard clone source](dashboard-clone1.png)

Cloned dashboard:
![Dashboard clone result](dashboard-clone2.png)

**Creating a New Dashboard**

Create a dashboard from scratch.

![New dashboard creation](dashboard-new.png)

**Copying Widgets**

Use Cmd+C/V to copy and paste widgets, and Cmd+Shift+K to check the clipboard.

![Widget copy](dashboard-widgets-copy.png)

**Adding Widgets**

Add new widgets to your dashboard.

![New widget](dashboard-widgets-new.png)

You can also use [Powerpack Widgets](https://docs.datadoghq.com/dashboards/widgets/powerpack/) to easily add advanced widgets.

![Powerpack widget (1)](dashboard-powerpack1.png)
![Powerpack widget (2)](dashboard-powerpack2.png)

**Grouping**

Use Cmd+G to group widgets. Ungroup by dragging and dropping.

![Widget grouping](dashboard-group.png)

**Metrics Explorer to Dashboard Export**

Create metrics in Metrics Explorer and export them directly to a dashboard.

![Export from Metrics Explorer to Dashboard](dashboard-export.png)

## Summary

Through the Datadog Learning Center, I was able to learn Datadog's fundamental operations and concepts. The entire curriculum can be completed in a single day, so I highly recommend giving it a try if you're interested.
