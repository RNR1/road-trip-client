import client from '$api/client';
import * as Transform from '$api/transform';
import type { BasicResponse } from '$typings/api';
import type { LoginPayload } from '$typings/auth';

export const Auth = {
	login: (body: LoginPayload) => client.post({ endpoint: '/auth/login', body }),
	signup: () => {}
};
