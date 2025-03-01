import torch
import torch.nn as nn

class XiangqiNetwork(nn.Module):
    def __init__(self):
        super(XiangqiNetwork, self).__init__()
        # Input: 9x10 board with multiple channels for different piece types
        self.conv1 = nn.Conv2d(in_channels=7, out_channels=256, kernel_size=3, padding=1)
        self.conv2 = nn.Conv2d(in_channels=256, out_channels=256, kernel_size=3, padding=1)
        
        # Policy head
        self.policy_head = nn.Sequential(
            nn.Conv2d(256, 2, kernel_size=1),
            nn.Flatten(),
            nn.Linear(180, 90)  # 90 possible moves (simplified)
        )
        
        # Value head
        self.value_head = nn.Sequential(
            nn.Conv2d(256, 1, kernel_size=1),
            nn.Flatten(),
            nn.Linear(90, 256),
            nn.ReLU(),
            nn.Linear(256, 1),
            nn.Tanh()
        )
    
    def forward(self, x):
        x = torch.relu(self.conv1(x))
        x = torch.relu(self.conv2(x))
        
        policy = self.policy_head(x)
        value = self.value_head(x)
        
        return policy, value