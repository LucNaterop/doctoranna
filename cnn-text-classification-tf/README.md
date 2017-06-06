
# Notes

This repo is a modification of the implementation here:

https://github.com/dennybritz/cnn-text-classification-tf

with multi-class support and support for tensorflow 1.0

# Usage
have data like the example file `data/train.txt` in the following format

```
text1....\t label1
text2....\t label2
text3....\t label1
text4....\t label3
```
Then run 
```
python train.py --train_data_path="./data/train.txt"
python eval.py --checkpoint_dir="./runs/1463968251/checkpoints/" --test_data_path="./data/test.txt"
```
You can also view the results on tensorboard using
```
tensorboard --logdir runs/1496762994/
```
