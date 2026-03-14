I used to gamble a bit online. Turns out I really hate losing money, so naturally I started looking into what actually gives you an edge. Basic strategy helps, but the real answer was card counting. Statistically it works, but I was too lazy to learn it myself, so I thought: why not train an AI to do it for me?

The idea was to build something that could watch a live game, recognize the cards on screen, count them in real time, and tell me the statistically best move to make.

I landed on YOLOv8 for the detection model. The problem was there were no premade datasets for the specific card tables I was playing on, which meant I had to build one myself. That meant manually labeling every card, across different tables, different positions, different lighting conditions.

That's where it stalled. The labeling alone was going to take forever, and I hadn't even started training yet. Shelved for now, but the idea isn't dead.