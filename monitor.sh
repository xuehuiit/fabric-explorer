#!/bin/bash

while [ 1 ];do
    sleep 10
    process_num=$(ps -elf | grep -v grep | grep node | wc -l)
    if [ ${process_num} -eq 0 ];then
        ./start.sh
    fi
done
