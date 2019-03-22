#!/bin/bash

python3 main_rasp.py | parallel python3 grabserial -T -o datos.txt