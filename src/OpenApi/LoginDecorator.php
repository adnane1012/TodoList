<?php

declare(strict_types=1);

namespace App\OpenApi;

use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\OpenApi;
use ApiPlatform\Core\OpenApi\Model;

final class LoginDecorator implements OpenApiFactoryInterface
{
    private $decorated;
    public function __construct(OpenApiFactoryInterface $decorated) {
        $this->decorated = $decorated;
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);
        $schemas = $openApi->getComponents()->getSchemas();

        $schemas['login'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'token' => [
                    'type' => 'string',
                    'readOnly' => true,
                ],
                'refresh_token' => [
                    'type' => 'string',
                    'readOnly' => true,
                ],
            ],
        ]);
        $schemas['Credentials'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'username' => [
                    'type' => 'string',
                    'example' => 'user1@peritis.fr',
                ],
                'password' => [
                    'type' => 'string',
                    'example' => 'peritis',
                ],
            ],
        ]);

        $pathItem = new Model\PathItem(
            'login',
            null,
            null,
            null,
            null,
            new Model\Operation(
                'postCredentialsItem',
                ['login'],
                [
                    '200' => [
                        'description' => 'Login and retrieve your Token',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/login',
                                ],
                            ],
                        ],
                    ],
                ],
                'Login and retrieve your Token',
                '',
                null,
                [],
                new Model\RequestBody(
                    'Credentials',
                    new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/Credentials',
                            ],
                        ],
                    ])
                )
            )
        );
        $openApi->getPaths()->addPath('/api/login_check', $pathItem);

        return $openApi;
    }
}