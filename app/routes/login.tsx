import {Form, useActionData} from '@remix-run/react';

export default function Index() {
  const actionData = useActionData<{error?: string; success?: string}>();

  return (
    <div className="flex items-center justify-center pt-12">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Faça seu login
        </h1>
        <Form method="post" className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-100"
                placeholder="seu@email.com"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Senha
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 text-sm text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-1 focus:ring-green-100"
                placeholder="Sua senha"
              />
            </div>
          </div>
          {actionData?.error && (
            <p className="text-red-500 text-sm text-center">
              {actionData.error}
            </p>
          )}
          {actionData?.success && (
            <p className="text-green-500 text-sm text-center">
              {actionData.success}
            </p>
          )}
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-md bg-green-500 text-white text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-200 transition duration-200"
          >
            Entrar
          </button>
        </Form>
      </div>
    </div>
  );
}
