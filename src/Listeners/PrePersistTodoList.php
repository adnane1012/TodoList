<?php

namespace App\Listeners;

use App\Entity\TaskList;
use Symfony\Component\Security\Core\Security;

class PrePersistTodoList
{
    /**
     * @var Security
     */
    private $security;

    /**
     * @param Security $security
     */
    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    /**
     * @param TaskList $taskList
     *
     * @return void
     */
    public function prePersist(TaskList $taskList)
    {
        if ($taskList->getUser()) {
            return;
        }

        if ($this->security->getUser()) {
            $taskList->setUser($this->security->getUser());
        }
    }
}
