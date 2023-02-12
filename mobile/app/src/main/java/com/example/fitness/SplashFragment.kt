package com.example.fitness

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.findNavController
import com.example.fitness.databinding.FragmentSplashBinding

class SplashFragment : Fragment() {

    lateinit var binding:FragmentSplashBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {

        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {

        binding = FragmentSplashBinding.inflate(layoutInflater)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        click()
    }

    private fun click(){
        binding.apply {
            txtStart.setOnClickListener {
                view?.findNavController()?.navigate(R.id.action_splashFragment_to_loginFragment)
            }

        }
    }



}