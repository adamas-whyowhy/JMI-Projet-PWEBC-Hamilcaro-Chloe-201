<?php


namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class MapController extends AbstractController
{
    /**
     * @Route("/map", name="map")
     */

    public function show(Request $request)
    {
        return $this->render('map.html.twig', ['ligne' => $request->query->get('num_ligne')]);
    }

}