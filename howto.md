---
layout: page
title: How To
subtitle: A guide to everything I've tried to do
---


### Intro
The first thing you need when wanting to look at NHL data is NHL data.  Unfortunately there isn't too much documentation, but there is an API and resources (like [https://github.com/Zmalski/NHL-API-Reference](https://github.com/Zmalski/NHL-API-Reference)) which help along the way.

The main things I wanted to achieve was a table with all actions.  For every shot, hit, goal etc. I wanted a table with all of the possible informatiion.  This could then be supplemented with standings information, roster information etc.

### Set Up
There are many different ways to do this.  My preference is to run python script in JupyterLab within Anaconda:
![AnacondaScreenshot](/assets/img/AnacondaScreenshot.png){: .mx-auto.d-block :}

You can then open a notebook:
![AnacondaScreenshot2](/assets/img/AnacondaScreenshot.png){: .mx-auto.d-block :}

### The Code
First things first, we need to import some libraries:

~~~
import requests
import pandas as pd
import datetime as dt
from datetime import datetime, timedelta
import json
import os
~~~

```python
import requests
import pandas as pd
import datetime as dt
from datetime import datetime, timedelta
import json
import os
```


####  #32
