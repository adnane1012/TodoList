<?php

declare(strict_types=1);

namespace App\OpenApi;

use ApiPlatform\Core\OpenApi\Factory\OpenApiFactoryInterface;
use ApiPlatform\Core\OpenApi\OpenApi;
use ApiPlatform\Core\OpenApi\Model;

final class RefreshTokenDecorator implements OpenApiFactoryInterface
{
    private $decorated;
    public function __construct(OpenApiFactoryInterface $decorated) {
        $this->decorated = $decorated;
    }

    public function __invoke(array $context = []): OpenApi
    {
        $openApi = ($this->decorated)($context);
        $schemas = $openApi->getComponents()->getSchemas();

        $schemas['refreshToken'] = new \ArrayObject([
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
        $schemas['token'] = new \ArrayObject([
            'type' => 'object',
            'properties' => [
                'refresh_token' => [
                    'type' => 'string',
                    'placeholder' => 'insert your refresh token',
                ]
            ],
        ]);

        $pathItem = new Model\PathItem(
            'Login',
            null,
            null,
            null,
            null,
            new Model\Operation(
                'postCredentialsItem',
                ['refreshToken'],
                [
                    '200' => [
                        'description' => 'Refreshed Token',
                        'content' => [
                            'application/json' => [
                                'schema' => [
                                    '$ref' => '#/components/schemas/refreshToken',
                                ],
                            ],
                        ],
                    ],
                ],
                'Refresh your Token',
                '',
                null,
                [],
                new Model\RequestBody(
                    'Refresh your Token',
                    new \ArrayObject([
                        'application/json' => [
                            'schema' => [
                                '$ref' => '#/components/schemas/token',
                            ],
                        ],
                    ])
                )
            )
        );
        $openApi->getPaths()->addPath('/api/token/refresh', $pathItem);

        return $openApi;
    }
}