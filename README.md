<h1 align="center">
 egg calculator
</h1>

<h4 align="center">An egg calculator for comparing egg prices at stores that list price per count, not price per weight.</h4>

<p align="center">
  <a href="https://github.com/mr-cal/egg-calculator/blob/main/LICENSE">
    <img alt="GitHub" src="https://img.shields.io/github/license/mr-cal/egg-calculator">
  </a>
</p>

## Overview

Source code for https://eggcalculator.com

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which dispatches a
`repository_dispatch` event to [mr-cal/vps-infra](https://github.com/mr-cal/vps-infra).
The vps-infra deploy workflow SSHs to the VPS, pulls the latest commit from this
repo via git submodule, and Caddy serves the `src/` directory.

Add a `VPSINFRA_PAT` secret to this repo (Settings → Secrets and variables → Actions)
with a fine-grained PAT scoped to `mr-cal/vps-infra` with **Contents: Read and write**.

## Contributing
Feel free to submit an issue or PR!
