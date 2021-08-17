import { askService, sleep, touch } from '@jsxcad/sys';

window.bootstrap = async () => {
  const agent = async ({ ask, message }) => {
    const { id, op, path, workspace } = message;
    switch (op) {
      case 'sys/touch':
        await touch(path, { workspace, id, clear: true, broadcast: true });
        return;
      case 'log':
        return;
      default:
        throw Error(`master/unhandled: ${JSON.stringify(message)}`);
    }
  };

  const serviceSpec = {
    webWorker: `./dist/testWorker.js`,
    agent,
    workerType: 'module',
  };

  console.log(`master/ask/write`);

  const wa = askService(serviceSpec, {
    op: 'write',
    path: 'test',
    value: 1,
    workspace: 'test',
  });
  const wb = askService(serviceSpec, {
    op: 'write',
    path: 'test',
    value: 5,
    workspace: 'test',
  });
  const wc = askService(serviceSpec, {
    op: 'write',
    path: 'test',
    value: 12,
    workspace: 'test',
  });
  const wd = askService(serviceSpec, {
    op: 'write',
    path: 'test',
    value: 18,
    workspace: 'test',
  });

  console.log(`master/sleep`);
  await sleep(1000);

  await wa;
  await wb;
  await wc;
  await wd;

  console.log(`master/ask/read`);
  const ra = askService(serviceSpec, {
    op: 'read',
    path: 'test',
    workspace: 'test',
  });
  const rb = askService(serviceSpec, {
    op: 'read',
    path: 'test',
    workspace: 'test',
  });
  const rc = askService(serviceSpec, {
    op: 'read',
    path: 'test',
    workspace: 'test',
  });
  const rd = askService(serviceSpec, {
    op: 'read',
    path: 'test',
    workspace: 'test',
  });

  console.log(`master/report`);
  console.log({ ra: await ra, rb: await rb, rc: await rc, rd: await rd });
};

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    window.bootstrap();
  }
};
