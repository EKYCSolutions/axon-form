import PocketBase from 'pocketbase';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJwYmNfMzE0MjYzNTgyMyIsImV4cCI6MTc1MzI1ODM4NywiaWQiOiIwOTdmYWRwdXNjNWV3dm4iLCJyZWZyZXNoYWJsZSI6ZmFsc2UsInR5cGUiOiJhdXRoIn0.L_C044AcggThsYhqfMam-s7Wi7zBZbPX1JYOX-oe1aI';

export const client = new PocketBase('http://127.0.0.1:8090');

client.authStore.save(token, null);

export const allPeeps = async (): Promise<any> => {
  return await client.collection('nodes').getList(1, 50, {});
};
