declare type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

declare interface HTTPClientConfig<T> {
	context?: { fetch: typeof fetch };
	endpoint: string;
	method?: Method;
	headers?: Record<string, string>;
	body?: T;
	params?: Record<string, string>;
}

declare type BasicResponse = {
	message: string;
};

export type { Method, HTTPClientConfig, BasicResponse };
