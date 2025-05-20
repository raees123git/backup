import torch
print(torch.cuda.is_available())       # Should be True
print(torch.cuda.device_count())       # Number of GPUs
print(torch.version.cuda)              # CUDA version PyTorch was built with
print(torch.cuda.get_device_name(0))   # Name of GPU 0
