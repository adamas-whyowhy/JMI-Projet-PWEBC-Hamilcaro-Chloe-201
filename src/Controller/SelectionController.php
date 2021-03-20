<?php


namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class SelectionController extends AbstractController
{
    /**
     * @Route("/selection", name="selection")
     */

    public function show()
    {
        return $this->render('selection.html.twig');
    }

    /**
     * @Route("/selection_action", name="selection_action")
     */

    public function redirection(Request $request)
    {
        return $this->redirectToRoute("map", ['num_ligne' => $_POST['ligne']]);
    }
}