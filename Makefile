# Copyright 2017 The Kubernetes Authors.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

.PHONY:	build push test

PREFIX = hub.bccvl.org.au/ecocloud
IMAGE = workspace-ui
TAG = 0.5.1

# prod commands

build:
	docker build -t $(PREFIX)/$(IMAGE):$(TAG) .

push:
	docker push $(PREFIX)/$(IMAGE):$(TAG)

test:
	docker run --rm -it -p 5000:5000 $(PREFIX)/$(IMAGE):$(TAG)

### dev commands

run:
	docker run --rm -it -p 5000:5000 -v $(PWD):/code -w /code node:8 bash

dist:
	docker run --rm -it -v $(PWD):/code -w /code node:8 yarn build

yarn:
	docker run --rm -it -v $(PWD):/code -w /code node:8 yarn

start:
	docker run --rm -it -p 5000:5000 -v $(PWD):/code -w /code node:8 yarn start

