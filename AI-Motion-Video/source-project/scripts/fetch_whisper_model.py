#!/usr/bin/env python3
"""Fetch the checksummed Whisper-small CTranslate2 model from npm packages.

The 237 MB model is intentionally not committed to Git. Transcripts are already
included, so this is only needed to rerun ASR. Uses only Python's standard library.
"""
from __future__ import annotations

import argparse
import hashlib
import io
from pathlib import Path
import tarfile
import tempfile
import urllib.request

BASE = "https://registry.npmjs.org/@skillninja/shortmovie-telop-model-p{0}/-/shortmovie-telop-model-p{0}-1.0.0.tgz"
EXPECTED = "ca732cb1379efc49417d028465f543d83a39de2c61f3027678de103dc404ce73"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[3]/".models"/"whisper-small")
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as temp:
        for i in range(4):
            url = BASE.format(i)
            print(f"Downloading model part {i+1}/4…", flush=True)
            with urllib.request.urlopen(url, timeout=180) as response:
                payload = response.read()
            with tarfile.open(fileobj=io.BytesIO(payload), mode="r:gz") as archive:
                for member in archive.getmembers():
                    if not member.isfile():
                        continue
                    name = Path(member.name).name
                    if name in {"config.json","preprocessor_config.json","tokenizer.json","vocabulary.json","LICENSE","README.md","model.sha256",f"model.bin.part{i}"}:
                        source = archive.extractfile(member)
                        if source:
                            (args.output/name).write_bytes(source.read())
    digest = hashlib.sha256()
    with (args.output/"model.bin").open("wb") as output:
        for i in range(4):
            part = (args.output/f"model.bin.part{i}").read_bytes()
            digest.update(part)
            output.write(part)
    if digest.hexdigest() != EXPECTED:
        raise RuntimeError("Model checksum mismatch; delete the output and retry.")
    for i in range(4):
        (args.output/f"model.bin.part{i}").unlink()
    print(f"Verified Whisper model at {args.output}")


if __name__ == "__main__":
    main()
