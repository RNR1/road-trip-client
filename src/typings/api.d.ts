declare type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

declare interface HTTPClientConfig<T> {
	context?: { fetch: typeof fetch };
	endpoint: string;
	method?: Method;
	headers?: Record<string, string>;
	body?: T;
}

declare type BasicResponse = {
	name: string;
};

export type { Method, HTTPClientConfig, BasicResponse };
